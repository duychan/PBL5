

#from csv_to_image import directory
directory="E:/ECG detection Example/DataTest/TestNSR"
from glob import glob
from keras.models import load_model
import numpy as np
from collections import Counter

model = load_model('E:\ECG detection Example\Data\Model\model.hdf5')

images = glob(directory + '/*.png')

pred_li = []
import cv2
for i in images:
    image = cv2.imread(i)
    pred = model.predict(image.reshape((1, 128, 128, 3)))
    
    y_classes = pred.argmax(axis=-1)
    pred_li.append(y_classes[0])    

most_common,num_most_common = Counter(pred_li).most_common(1)[0]
print(most_common)
if(most_common == 0):
	print('The patient may have AF')
	print('Number of beats of AF tpye are ' + str(num_most_common) + ' out of ' + str(len(images)))
elif(most_common == 1):
	print('The patient may be healthy.')
	print('Number of beats of healthy tpye are ' + str(num_most_common) + ' out of ' + str(len(images)))




