
from glob import glob
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0, 1, 2, 3
from keras.models import load_model
from collections import Counter
import cv2  
import biosppy
import os
import matplotlib.pyplot as plt

class PredictArrhythmia():
	# Phân đoạn array
	def segmentation(self, signal):
		data=signal
		signals = []
		count = 1
		peaks =  biosppy.signals.ecg.christov_segmenter(signal=data, sampling_rate = 360)[0]
		for i in (peaks[1:-1]):
			diff1 = abs(peaks[count - 1] - i)
			diff2 = abs(peaks[count + 1]- i)
			x = peaks[count - 1] + diff1//2
			y = peaks[count + 1] - diff2//2
			signal = data[x:y]
			signals.append(signal)
			count += 1
		return signals

	# Convert array to image
	def array_to_img(self, array, directory):  
		count=1
		for _,i in enumerate(array):
			
			fig = plt.figure(frameon=False)
			plt.plot(i) 
			plt.xticks([]), plt.yticks([])
			for spine in plt.gca().spines.values():
				spine.set_visible(False)

			filename = directory + '/{}.png'.format(count)
			fig.savefig(filename)
			im_gray = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
			im_gray = cv2.resize(im_gray, (128, 128), interpolation = cv2.INTER_LANCZOS4)
			cv2.imwrite(filename, im_gray)
			plt.cla()
			plt.clf()
			plt.close('all')
			count+=1

	def signal_to_image(self, signal):			
		array=self.segmentation(signal)
		self.array_to_img(array,self.directory)


	def predict(self,signal,user_name):

		self.directory="E:/PBL5/algorithm/data_predict/"+user_name
		os.makedirs(self.directory,exist_ok =True)

		self.signal_to_image(signal)

		# down model trc khi sử dụng
		model = load_model('E:/PBL5/algorithm/best_model.hdf5')
		images = glob(self.directory + '/*.png')
		pred_li = []
		for i in images:
			image = cv2.imread(i)
			pred = model.predict(image.reshape((1, 128, 128, 3)), verbose= 0)			
			y_classes = pred.argmax(axis=-1)
			pred_li.append(y_classes[0])    

		# print("y_class",pred_li)
		most_common,num_most_common = Counter(pred_li).most_common(1)[0]
		print(most_common)
		
		#if(most_common == 0):
			#print('The patient may have Atrial Fibrillation (AFIB).')
			#print('Number of beats of AFIB tpye are ' + str(num_most_common) + ' out of ' + str(len(images)))

		#elif(most_common == 1):
			#print('The patient may be healthy.')
			#print('Number of beats of healthy tpye are ' + str(num_most_common) + ' out of ' + str(len(images)))


import sys
#z = list(map(int,sys.argv[1].split(",")))

from time import sleep
import scipy.io
import numpy as np
path = 'E:/PBL5/algorithm/201m-0.mat'
data=scipy.io.loadmat(path)
data=np.array(data['val'][0])
signal = data
clf=PredictArrhythmia()
clf.predict(signal,'Thai')

