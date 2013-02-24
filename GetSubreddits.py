import sys, os

sys.path.append(os.path.abspath('reddiwrap'))

from ReddiWrap import ReddiWrap
import json
import time
import xml.etree.ElementTree as ET

def get_nested_comments(comment):
	comment_str = ""
	for ch_com in comment.children:
		comment_str += " " + comment.body + get_nested_comments(ch_com)
	return comment_str

reddit = ReddiWrap()

USERNAME = 'r_topics'
PASSWORD = 'socialviz'
for a in range(1, len(sys.argv)):
	SUB = sys.argv[a]

	#Log in
	reddit.load_cookies('cookies.txt')

	if not reddit.logged_in or reddit.user.lower() != USERNAME.lower():
		print('logging into %s' % USERNAME)
		login = reddit.login(user=USERNAME, password=PASSWORD)
		if login != 0:
			print('unable to log in: %d' % login)
			print('remember to change USERNAME and PASSWORD')
			exit(1)
		reddit.save_cookies('cookies.txt')
	print('logged in as %s' % reddit.user)

	#Get posts in subreddit SUB
	posts = reddit.get('/r/%s' % SUB)
	print('getting posts in subreddit /r/%s' % SUB)
	while reddit.has_next():
		posts += reddit.get_next()
		time.sleep(2)	
	print('number of posts in /r/%s: %d' % (SUB, len(posts)))

	#Set up XML
	srn = ET.Element('searchresult')
	subredditnode = ET.SubElement(srn, SUB)

	#Set up for JSON dump
	subreddit = {}

	#Get data for each post
	for i in range(len(posts)):
		print('Getting post %d of %d' % (i, len(posts)))
		#XML
		dn = ET.SubElement(srn, 'document')
		p = posts[i]
		reddit.fetch_comments(p)
		time.sleep(2)
		#title info
		title = ET.SubElement(dn, 'title')
		title.text = p.title
		#link info
		url = ET.SubElement(dn, 'url')
		url.text = p.url
		#snippet, self and comment text
		snippet_str = ""
		if (p.is_self):
			snippet_str += p.selftext
		for c in range(len(p.comments)):
			snippet_str += " " + get_nested_comments(p.comments[c])
			p.comments[c] = p.comments[c].__dict__
			p.comments[c]['children'] = []
		snippet = ET.SubElement(dn, "snippet")
		snippet.text = snippet_str
		#JSON
		subreddit[i] = p.__dict__

		#Dump json
		jsonfile = open('data/' + SUB + '_reddit.json', 'w')
		json.dump(subreddit, jsonfile)
		jsonfile.close()

		#Write XML
		xmlfile = open('data/' + SUB + '_reddit.xml', 'w')
		ET.ElementTree(srn).write(xmlfile)
		xmlfile.close()

