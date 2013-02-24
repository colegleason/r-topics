#! /usr/bin/env python

import sys, json, time
from datetime import date, timedelta

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)

def get_popularity(day, documents, reddit_info):
    popularity_for_day = 0
    for doc in documents:
        post = reddit_info[str(doc)]
        if day.fromtimestamp(post["timestamp"]) == day:
            popularity_for_day += post["num_votes"] + post['num_comments']
    return popularity_for_day

if __name__ == "__main__":
    
    if len(sys.argv) != 4:
        raise Exception("usage: ./combine_data.py cluster_info.json reddit_info.json output_file.json")
    
    cluster_file = sys.argv[1]
    reddit_file = sys.argv[2]
    output_file = sys.argv[3]
        
    with open(cluster_file, "r") as f:
        all_cluster_info = json.loads(f.read())
        cluster_info = all_cluster_info["clusters"]
    with open(reddit_file, "r") as f:
        reddit_info = json.loads(f.read())

    earliest_post = min(reddit_info.iteritems(), key=lambda x: x[1]["timestamp"])
    latest_post = max(reddit_info.iteritems(), key=lambda x: x[1]["timestamp"])
    
    start_date = date.fromtimestamp(earliest_post[1]["timestamp"])
    end_date = date.fromtimestamp(latest_post[1]["timestamp"]) + timedelta(days=1)
    combined_data = []

    for cluster in cluster_info:
        values = {}
        for day in daterange(start_date, end_date):
            values[day.strftime("%s")] = get_popularity(day, cluster["documents"], reddit_info)
        cluster["values"] = values
        combined_data.append(cluster)

    all_cluster_info["clusters"] = combined_data

    with open(output_file, "w") as f:
        output = json.dumps(all_cluster_info)
        f.write(output)
