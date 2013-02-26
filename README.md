/r/topics
=========

##A visualiszation of subreddits created by Cole Gleason, Ciara Proctor, and Adam Yala for CS 467.##

###Audience###
Long-term Reddit users, especially those who frequent subreddit
groups, who are interested in seeing topic shifts in subreddits.

###Motivation###
We are curious to see how the subreddits that we read have
changed over time. Have popular topics of discussion in the subreddit have
changed, or has our perception of the subreddit changed?

###Patterns###
We want to see how the popularity of topics changes with respect
to the number of users, upvotes and downvotes, comments, and other
activity within the subreddit. We want to see if and when dramatic shifts in
topics occur, and how these shifts correspond to subreddits branching off.

###Visualization###
We will display a word cloud of the important topics of a
subreddit over time using a rolling window. Clicking on any of the words in
the cloud will open a graph of the topic’s popularity over time. Topics will be
determined by using clustering algorithms on all text components of a post,
the title and comments. The importance of a topic will be determined by the
quantity of upvotes and downvotes, comments, and posts corresponding to
the specific topic.

#How to use:#

Check out the submodules:

    git submodule init
    git submodule update

Start a server using:

    python -m SimpleHTTPServer 8888

Then open your browser and head to [http://localhost:8888/index.html](http://localhost:8888/index.html)

#Adding Subreddits:#
r/topics has the data from several subreddits pulled and ready to use. However, 
if you would like to add additional subreddits, do the following:

Get the data from the subreddit using the get_subreddits.py script
	
	./scripts/get_subreddits.py <subreddit name>

Cluster the data using the carrot2 command line interface. carrot2 can be 
downloaded from [http://carrot2.org](http://carrot2.org). Run the clustering 
algorithm with the options "-d -t -f JSON -o <path to r-topics>/data/clustering"

Combine the clusters using the combine_clusters.py script

	./scripts/combine_clusters.py <subreddit name>

Combine the reddit data with the clusters using the combine_data.py script

	./scripts/combine_data.py <cluster info> <reddit info> <output location>

This will typically look like the following:
	./scripts/combine_data.py data/clusters/<subreddit>_reddit.json 
		data/<subreddit>_reddit.json data/<subreddit>_combined.json

As long as the combined file is of the form data/<subreddit>_combined.json
the subreddit will be available in the graph viewer.
