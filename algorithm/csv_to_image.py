#path = "E:\ECG detection Example\CNN\example.csv"
#directory = input("Enter the directory where you want to save the images: ")
#directory="E:\ECG detection Example\CNN\Image"
import pandas as pd
import numpy as np     
import biosppy
import scipy.io
import os

def main(path, directory):
    def segmentation(path):
       
        data=scipy.io.loadmat(path)
        data=np.array(data['val'][0])

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
    
    def signal_to_img(array, directory,count):  
        import cv2
        import matplotlib.pyplot as plt

        for _,i in enumerate(array):
            fig = plt.figure(frameon=False)
            plt.plot(i) 
            plt.xticks([]), plt.yticks([])
            for spine in plt.gca().spines.values():
                spine.set_visible(False)

            filename = directory + '/' + str(count)+'.png'
            fig.savefig(filename)
            im_gray = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
            im_gray = cv2.resize(im_gray, (128, 128), interpolation = cv2.INTER_LANCZOS4)
            cv2.imwrite(filename, im_gray)
            count+=1
        return count

   

    count=0
    directory=save_folder+ "/TestAF"
    os.makedirs(directory)
    for filename in os.listdir(root_folder):
        path=root_folder+"\\"+filename
        array = segmentation(path)
        count=signal_to_img(array, directory ,count)

# root_folder là tập tín hiệu ecg
# save_folder là folder để lưu hình ảnh output  
root_folder=r"E:/ECG detection Example/DataTest/Test"
save_folder="E:/ECG detection Example/DataTest"

directory = main(root_folder, save_folder)
    
