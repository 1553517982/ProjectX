import os
import sys
import re
import ConfigParser

classNameList = []
filterList = []
reflactList = {}
ignoreList = {}
inputDir=""
outputDir=""


def getClassDefine(filePath,fileName):
	f = open(filePath,"r")
	lines = f.readlines()
	f.close()
	length =len(lines)

        if length == 0:
                return
        global classNameList
        global ignoreList
        
                
        pattern = re.compile(r'class (\w+)', re.I)

        patternenum = re.compile(r'enum (\w+)', re.I)
                 
        for line in lines:
            m = pattern.match(line)
            em = patternenum.match(line)
            if m :
                className = m.group(1)
                #print className
                classNameList.append(className)
                if(filePath.find('src//AI')>=0):
                      if not ignoreList.has_key(className):
                             ignoreList.setdefault(className,className) 
            elif em:
                className = em.group(1)
                #print className
                classNameList.append(className)                    
               
def getPathClassDefine(path, file_types):
    for file in os.listdir(path):
        filepath = path + "//"+file 
        if os.path.isdir(filepath):
            getPathClassDefine(filepath, file_types)
        elif os.path.isfile(filepath):
            splitlist = filepath.split('.')
            m = len(splitlist)
            prefx = splitlist[m-1]
            
            if prefx in file_types:
                getClassDefine(filepath,file)

                
def getReplaceWords(key):
        global reflactList
        if( reflactList.has_key(key)):
                return reflactList.get(key)
        else:
                return key

def replaceWords2(subStr):
        words = re.compile(r'(\w*\w*)')
        findPart = words.findall(subStr)
        if(len(findPart)>0):
                for subwords in findPart:
                        subStr = subStr.replace(subwords,getReplaceWords(subwords))  
                return subStr
        else:
                return getReplaceWords(subStr)

def replaceWords(subStr):
    subparts = subStr.split('.')
    if(len(subparts)>0):
         aftertext = ""
         index = 0
         center = ""
         for sub in   subparts:
                 if index > 0:
                         center = "."
                 aftertext = aftertext + center + replaceWords2(sub)
                 index = index + 1
         subStr = aftertext      
    else:            
        subStr = replaceWords2(subStr,wordsList)
    return subStr

def replaceSubStr(subStr):
        afterText=""
        needCheck = True 
        #protobuff need ignore
        if(subStr.find('\"')>=0  and subStr.find('.')>=0 ):
                needCheck = False
        if(subStr.find('/')< 0 and needCheck):
                afterText = replaceWords(subStr)
        else:
                afterText = subStr
        
        return afterText

def formatStr(paramStr):
        paramStr = paramStr.strip()
        paramStr = paramStr.replace('//',' // ')
        paramStr = paramStr.replace(':',' : ')
        paramStr = paramStr.replace('(',' ( ')
        paramStr = paramStr.replace(',',' , ')
        paramStr = paramStr.replace(';',' ; ')
        paramStr = paramStr.replace('  ',' ')
        paramStr = paramStr.replace('[',' [')
        return paramStr

def getReplacedText(paramStr):
        parts = paramStr.split(' ')
        afterText = ""
        if(len(parts) > 0):
                for subStr in parts:
                    afterText=afterText+ ' ' +replaceSubStr(subStr)
        else:
                afterText = paramStr
        return afterText


def replaceFileContent(filePath):
        f = open(filePath,"r")
	lines = f.readlines()
	f.close()
	length =len(lines)

        if length == 0:
                return
        
        newcontent = ""
        for line in lines:
                text = formatStr(line)
                aftertext = getReplacedText(text)
                aftertext=aftertext.replace(' : ',':')
                aftertext=aftertext.replace(' , ',',')
                aftertext=aftertext.replace(' ; ',';')
                aftertext=aftertext.replace(' (','(')
                aftertext=aftertext.replace('( ','(')
                aftertext=aftertext.replace('// ','//')
                aftertext=aftertext.replace(' [','[')
                aftertext=aftertext.strip()
                if(len(aftertext)>0):
                        if(aftertext[0:2] == '//'):
                                #print('need ignore')
                                a = 1
                        elif(aftertext[0:11] == 'console.log'):
                                #print('is log ')
                                b = 1
                        elif(aftertext[0:9] == 'egret.log'):
                                #print('is log ')
                                c = 1
                        elif(aftertext[0:10] == 'egret.warn'):
                                #print('is log ')
                                c = 1
                        elif(aftertext[0:12] == 'console.warn'):
                                c = 2
                        elif(aftertext[0:13] == 'console.error'):
                                c = 3
                        elif(aftertext[0:11] == 'egret.error'):
                                c = 3
                        else:        
                                newcontent = newcontent + aftertext+'\n'

        outpath = os.path.abspath(filePath)
        global inputDir
        global outputDir
        newPath = outpath.replace(inputDir,outputDir)
        if(not os.path.exists(newPath)):
                if(not os.path.exists(os.path.dirname(newPath))):
                        os.mkdir(os.path.dirname(newPath))

        while(True):
                firstIndex = newcontent.find('/*')
                nextIndex = newcontent.find('*/')
                if(firstIndex> -1 and nextIndex>-1 and nextIndex>firstIndex ):
                      newcontent = newcontent.replace(newcontent[firstIndex:nextIndex+2],' ')  
                else:
                        break
        f = open(newPath,"w+")
        f.write(newcontent)
        f.close()

def replacePathFileContent(path, file_types):
    for file in os.listdir(path):
        filepath = path + "//"+file 
        if os.path.isdir(filepath):
            replacePathFileContent(filepath, file_types)
        elif os.path.isfile(filepath):
            splitlist = filepath.split('.')
            m = len(splitlist)
            prefx = splitlist[m-1]
            
            if prefx in file_types:
                replaceFileContent(filepath)

def getIndexWords(index):
        ret = ""
        pre = index+26
        tail = chr(97+pre%26)
        while(pre>=26):
            pre=int(pre/26)
            ret=ret+chr(65+pre%26)
        ret = ret + tail
        return ret
                
file_type_list = ["ts"]

if __name__ == '__main__':
    conf = ConfigParser.ConfigParser()
    print("===========================================================")
    print("* author zhibang.p      no.18102671617      ")
    print("* copyright fenggugame   ")
    print("* this tool will auto mix all of class name and enum name")
    print("* filterwords.ini can config code mix rules")
    print("* put extend keywords under [needmix] to mix extend keywords")
    print("* put extend keywords under [ignore] not to mix")
    print("===========================================================")

    ignoreList = {}
    #init dir 
    conf.read("filterwords.ini")
    inputDir = conf.get('dirconfig','mixDir')
    outputDir = conf.get('dirconfig','outPut')
    print ("mix code dir: "+ inputDir)
    print ("output code dir: "+ outputDir)
    path = inputDir
    #get  all class  enum keywords to mix
    getPathClassDefine(path, file_type_list)

    #keywords no need mix
    
    items2 = conf.items("ignore")
    if (len(items2)>0):
            for item in items2:
                if not ignoreList.has_key(item[1]):
                        ignoreList.setdefault(item[1],item[1])
                
    
    #extend keywords need mix
    extendlist = {}
    items = conf.items("needmix")
    if (len(items)>0):
            for item in items:
                    extendlist.setdefault(item[1],item[1])
                    classNameList.append(item[1])

    classNameList.sort()
    
    
    content = ""
    content2=""
    index = 1
    #make keywords replace name
    reflactList = {}
    for className in classNameList:
        #if ignoreList.has_key(className):
                content = content + "\""+className+"\"="+ className +"\n"
                content2 = content2 + "window[\""+className+"\"]="+className+"\n"
        #else:
        #        replaceClassName = getIndexWords(index)
        #        content = content + "\""+className+"\"="+ replaceClassName +"\n"
        #        if not extendlist.has_key(className):
        #                content2 = content2 + "window[\""+replaceClassName+"\"]="+replaceClassName+"\n"
        #        reflactList.setdefault(className,replaceClassName)
        #        index = index + 1
        
    #replace code keywords
    #replacePathFileContent(path,file_type_list)

    #out put class define 
    fclassDefine = open(outputDir+"/ClassNameConfig.ts","w+")
    fclassDefine.write(content2)
    fclassDefine.close()
    
    #out put class replaced name
    fo = open("mixedclass","w+")
    fo.write(content)
    fo.close()

    print("mix success!")
    os.system("pause")
    

