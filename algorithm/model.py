import numpy as np
import keras
from scipy import stats
from keras.models import Sequential
from keras.layers import Dense, Activation, Flatten, Conv2D, Dropout, MaxPool2D

from keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf



from keras.callbacks import ModelCheckpoint

batch_size = 32

IMAGE_SIZE = [128, 128]

import pathlib
filepath = "E:\ECG detection Example\Data\Model"
root_folder="E:\ECG detection Example\Data"
data_dir = pathlib.Path(root_folder)


train_path= "E:\ECG detection Example\Data\Train"
valid_path= "E:\ECG detection Example\Data\Valid"

checkpoint = ModelCheckpoint(filepath,
                            monitor='val_acc',
                            verbose=1,
                            save_best_only=True,
                            mode='max')



from tensorflow.keras.layers import BatchNormalization

model = Sequential()
model.add(Conv2D(64, (3,3),strides = (1,1), input_shape = IMAGE_SIZE + [3],kernel_initializer='glorot_uniform'))


model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(Conv2D(64, (3,3),strides = (1,1),kernel_initializer='glorot_uniform'))

model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(MaxPool2D(pool_size=(2, 2), strides= (2,2)))

model.add(Conv2D(128, (3,3),strides = (1,1),kernel_initializer='glorot_uniform'))

model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(Conv2D(128, (3,3),strides = (1,1),kernel_initializer='glorot_uniform'))

model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(MaxPool2D(pool_size=(2, 2), strides= (2,2)))

model.add(Conv2D(256, (3,3),strides = (1,1),kernel_initializer='glorot_uniform'))

model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(Conv2D(256, (3,3),strides = (1,1),kernel_initializer='glorot_uniform'))

model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(MaxPool2D(pool_size=(2, 2), strides= (2,2)))

model.add(Flatten())

model.add(Dense(2048))


model.add(keras.layers.ELU())

model.add(BatchNormalization())

model.add(Dropout(0.5))

model.add(Dense(2, activation='softmax'))


model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

#print(model.summary())

gen = ImageDataGenerator()

test_gen = gen.flow_from_directory(valid_path, target_size=IMAGE_SIZE)

train_gen = gen.flow_from_directory(train_path, target_size=IMAGE_SIZE)

train_generator = gen.flow_from_directory(
  train_path,
  target_size=IMAGE_SIZE,
  shuffle=True,
  batch_size=batch_size,
)
valid_generator = gen.flow_from_directory(
  valid_path,
  target_size=IMAGE_SIZE,
  shuffle=True,
  batch_size=batch_size,
)

callbacks_list = [checkpoint]

r = model.fit(
  train_generator,
  validation_data=valid_generator,
  epochs=50,
  steps_per_epoch=356702//batch_size,
  validation_steps=39634//batch_size,
  callbacks=callbacks_list
)
#model.save("E:\ECG detection Example\Data\Model\model.hdf5")


# from glob import glob
# import cv2
# from collections import Counter

# test_path="E:\ECG detection Example\DataTest\TestNSR"
# images = glob(test_path + '/*.png')
# pred_li=[]
# for i in images:
#   image = cv2.imread(i)
#   pred = model.predict(image.reshape((1, 128, 128, 3)))
#   y_classes = pred.argmax(axis=-1)
#   pred_li.append(y_classes[0]) 

# most_common,num_most_common = Counter(pred_li).most_common(1)[0]
# print(most_common ,num_most_common)