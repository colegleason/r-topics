import sys, os
sys.path.append(os.getcwd() + '/reddiwrap')
from ReddiWrap import ReddiWrap
from yaml import dump
import time

reddit = ReddiWrap()

USERNAME = 'r_topics'
PASSWORD = ''
SUB = 'topics'

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

 
posts = reddit.get('/r/%s' % SUB)
print('getting posts in subreddit /r/%s' % SUB)
while reddit.has_next():
	posts += reddit.get_next()
	time.sleep(2)	
print('number of posts in /r/%s: %d' % (SUB, len(posts)))


subreddit = {}

#each post is a dictionary, contains title, is_self, selftext, comments, num_comments
for i in range(len(posts)):
	reddit.fetch_comments(posts[i])
	time.sleep(2)
	subreddit[i] = posts[i]

print dump(subreddit)

yamlfile = open(SUB + '.yaml', 'w')
dump(subreddit, yamlfile)
yamlfile.close()
