#! /usr/bin/env python

# must be in carrot dir and expects data to be in sibling dir

import glob
import subprocess
#Get files that need to be clustered
files = glob.glob('../data/reddit_xml/*.xml')
#Run clustering on file, write output in JSON format to ../data/clusters
for f in files:
	subprocess.call("./batch.sh %s -o ../data/clusters/ -f JSON -d -t" % f, shell=True)
