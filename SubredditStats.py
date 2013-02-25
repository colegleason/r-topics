import json, sys
from datetime import date

if len(sys.argv) != 2:
	print('usage: python SubredditStats.py <subreddit>')
	exit(1)

month_names = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

json_data_file = open('data/' + sys.argv[1] + '_reddit.json', 'r')
json_data = json.load(json_data_file)
json_data_file.close()

months = {}

for key in json_data:
	post = json_data[key]
	d = date.fromtimestamp(post['created'])
	if d.month in months:
		months[d.month] = months[d.month] + 1
	else:
		months[d.month] = 1

print (months)
