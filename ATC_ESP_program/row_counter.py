import os

def main():
	rootdir = "."
	rows = 0
	filesNumber = 0
	for folder, subs, files in os.walk(rootdir):
		if("node_modules" in str(folder)):
			print("Skipping folder: " + str(folder))
			continue
		for filename in files:
			if('package' in str(filename)):
				continue
			if ".h" in filename or ".cpp" in filename or ".ts" in filename or ".tsx" in filename:
				filesNumber += 1
				fileRows = 0
				with open("./" + str(folder) + "/" + str(filename), 'r') as file:
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
