import sys, os

sys.path.append(os.path.abspath('reddiwrap'))

from ReddiWrap import ReddiWrap
import json
import time
import xml.etree.ElementTree as ET

reddit = ReddiWrap()

USERNAME = 'r_topics'
PASSWORD = 'socialviz'
SUB = 'topics'

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
	for comment in p.comments:
		snippet_str += " " + comment.body
	snippet = ET.SubElement(dn, "snippet")
	snippet.text = snippet_str
	#JSON
	post = {}
	post['num_comments']= p.num_comments
	post['num_votes'] = p.upvotes + p.downvotes
	post['timestamp'] = p.created
	subreddit[i] = post

#Dump json
jsonfile = open(SUB + '.json', 'w')
json.dump(subreddit, jsonfile)
jsonfile.close()

#Write XML
xmlfile = open(SUB + '.xml', 'w')
ET.ElementTree(srn).write(xmlfile)
xmlfile.close()
