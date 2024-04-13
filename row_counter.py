import os

def main():
	rootdir = "."
	rows = 0
	filesNumber = 0
	for folder, subs, files in os.walk(rootdir):
		if("node_modules" in str(folder) or "." in str(folder)[1:]):
			continue
		for filename in files:
			if('package' in str(filename)):
				continue
			if filename.endswith(".h") or filename.endswith(".cpp") or filename.endswith(".ts") or filename.endswith(".tsx") or filename.endswith(".php"):
				filesNumber += 1
				fileRows = 0
				with open("./" + str(folder) + "/" + str(filename), 'r+') as file:
					row = file.readline()
					while row:
						rows += 1
						fileRows += 1
						row = file.readline()
					print(folder, "/", filename, "=>", fileRows)
					fileRows = 0
	print("Number of rows are: " + str(rows))
	print("Number of files are: " + str(filesNumber))
    
if __name__ == '__main__' :
    main()
