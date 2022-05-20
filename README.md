# CopyCat

CopyCat is a mobile application that allows users to remove the background from images using ML and transfer them directly to their computer with minimal effort.

## Tech Stack
This mobile application is developer using [Expo](https://expo.io) and [React Native](https://reactnative.dev), coupled with [Supabase](Supabase.com) for handling User Authentication as well as providing a real-time database.

[U2Net](https://github.com/xuebinqin/U-2-Net) is the modal that is used to to detect the object on images and remove the background.

[Google Vision API](https://cloud.google.com/vision) is used to handle OCR for detecting text from images, as well as generating a label for images and blocking adult content.

[Web3 Storage](web3.storage) is used in order to store the images saved by the users.

## Features

* **Removing background from images** : The app can be used to isolate objects and remove the background, the user can either download and use the result locally or store it to the database for later use.

![removed-background](https://user-images.githubusercontent.com/62159014/169476522-e87fa7b9-430d-420d-8125-db8dedaa9544.jpeg)

* **Transfer Result images directly to the desktop** : Using the desktop application paired with the mobile application users can 
![Transfer Image](https://user-images.githubusercontent.com/62159014/169476535-acc35e93-fa78-4f5c-a3a3-980fbfc7c604.gif)


* **Extract text from images** : The app allows users to exctract text from images taken and allows them to transfer it directly to their computers as well
* 
![Transfer Text](https://user-images.githubusercontent.com/62159014/169476940-48a49943-f733-4793-92d6-7e3c37b8cb1b.gif)



* **Explore Page** : Users can share/find scans done by other users that they can use without the need to scan their own objects 