import json

full_dict = {}

for i in range(18):
    with open("data/compsci"+str(i)+"_reddit.json", "r") as f:
        json_data = json.loads(f.read())
        full_dict.update(json_data)

with open("data/compsci_reddit.json", "w") as f:
    f.write(json.dumps(full_dict))
