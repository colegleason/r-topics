#! /usr/bin/env python

import sys, json, time
from datetime import date, timedelta

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)

def get_popularity_all(documents, reddit_info):
    total_popularity = 0
    for doc in documents:
        post = reddit_info[str(doc)]
        total_popularity +=  post["upvotes"] + post["downvotes"] + post['num_comments']
    return total_popularity
                       
def get_popularity_day(day, documents, reddit_info):
    popularity_for_day = 0
    for doc in documents:
        post = reddit_info[str(doc)]
        if day.fromtimestamp(post["created"]) == day:
            popularity_for_day += post["upvotes"] + post["downvotes"] + post['num_comments']
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

    overall_activity = 0

    new_clusters = []

    for cluster in cluster_info:
        if "Other Topics" not in cluster["phrases"]:
            cluster["total_activity"] = get_popularity_all(cluster["documents"], reddit_info)
            overall_activity += cluster["total_activity"]
            cluster["created"] = reddit_info[str(cluster["id"])]["created"]
            new_clusters.append(cluster)

    for cluster in new_clusters:
        cluster["frac_activity"] = float(cluster["total_activity"])/overall_activity

    if len(cluster_info) > 40:
        pruned = sorted(new_clusters, key= lambda x: x["frac_activity"])
    else:
        pruned = new_clusters

    earliest_post = min(pruned, key=lambda x: x["created"])
    latest_post = max(pruned, key=lambda x: x["created"])
    
    start_date = date.fromtimestamp(earliest_post["created"])
    end_date = date.fromtimestamp(latest_post["created"]) + timedelta(days=1)

    for cluster in pruned:
        values = []
        for day in daterange(start_date, end_date):
            day_values = {}
            day_values["x"] = int(day.strftime("%s"))
            day_values["y"] = get_popularity_day(day, cluster["documents"], reddit_info)
            values.append(day_values)
        cluster["values"] = values

    all_cluster_info["clusters"] = pruned

    print len(all_cluster_info["clusters"])

    with open(output_file, "w") as f:
        output = json.dumps(all_cluster_info)
        f.write(output)
