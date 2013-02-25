#Place this in carrot2-cli-3.6.2 
# Assumes that data is stored in the parent directory

import glob
import subprocess
#Get files that need to be clustered
files = glob.glob('../data/*.xml')
#Run clustering on file, write output in JSON format to ../data/clusters
for f in files:
	subprocess.call("./batch.sh %s -o ../data/clusters -f JSON -d -t" % f, shell=True)


