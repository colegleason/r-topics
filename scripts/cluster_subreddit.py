#! /usr/bin/env python

if len(sys.argv) != 3:
	print 'usage: ./cluster_subreddit carrot_batch_file subreddit_dir'
	exit(-1)

import glob
import subprocess
#Get files that need to be clustered
files = glob.glob(argv[2]+'*.xml')
#Run clustering on file, write output in JSON format to ../data/clusters
for f in files:
	subprocess.call("./"+argv[1]+" %s -o ../data/clusters -f JSON -d -t" % f, shell=True)


