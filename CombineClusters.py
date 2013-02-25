import sys, glob, json

#Get subreddit 
SUB = sys.argv[1]
#Get files to combine
combine_files = glob.glob('data/clusters/' + SUB + '*_reddit.json')
if len(combine_files) == 0:
	print('There are no files to combine')
	exit(1)

combined_data_file = open('data/clusters/' + SUB + '0_reddit.json')
combined_data = json.load(combined_data_file)
combined_data_file.close()
c_clusters = combined_data['clusters']
c_documents = combined_data['documents']

for i in range(len(combine_files)):
	#open next file
	#get set number
	start_index = len('data/clusters/' + SUB)
	stop_index = combine_files[i].index('_')
	if start_index != stop_index and (int((combine_files[i])[start_index:stop_index]) != 0):
		file_set = int((combine_files[i])[start_index:stop_index])
		data_file = open(combine_files[i])
		data = json.load(data_file)
		data_file.close()
		clusters = data['clusters']
		documents = data['documents']
		for cluster in clusters:
			phrase = cluster['phrases']
			found = False
			for c_cluster in c_clusters:
				if phrase == c_cluster['phrases']:
					c_doc = c_cluster['documents']
					for doc in cluster['documents']:
						c_doc.append(doc + (50*file_set))
					found = True
			if found == False:
				cluster['id'] = len(c_clusters)
				c_clusters.append(cluster)
			
		#search for cluster in list where phrases are same
			#update document lists
			#OR add cluster to c_clusters
	#for each document
		for doc in documents:
		#add to id, append to c_documents
			doc['id'] = doc['id'] + (50*file_set)
			c_documents.append(doc)

combined_data['clusters'] = c_clusters
combined_data['documents'] = c_documents
#write back out to file 
combined_file = open('data/clusters/' + SUB + '_reddit.json', 'w')
output = json.dumps(combined_data)
combined_file.write(output)
combined_file.close()	
