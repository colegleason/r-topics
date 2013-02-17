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