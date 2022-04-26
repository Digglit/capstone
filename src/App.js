import React, { Component } from 'react'
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { AnimatePresence, motion } from 'framer-motion';
import { pageTransitionLeft, pageTransitionRight, transitionDuration } from './Util/Animations'
import UploadImage from './Pages/UploadImage/UploadImage';
import database from './Util/FirebaseConfig'
import { ref, onValue, set } from 'firebase/database'
import { getStorage, uploadBytes, ref as imageStorageRef } from "firebase/storage";
import SelectObjects from './Pages/SelectObjects/SelectObjects';
import ViewResults from './Pages/ViewResults/ViewResults';
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

class App extends Component {
  constructor() {
    super()
    this.state = {
      lightMode: false,
      tabSelected: 1,
      imageToPreview: 0,
      fileList: [],
      shiftLeft: false,
      resultsFileList: [],
      resultToPreview: 0,
      isLoading: false,
      imgData: null,
      predictions: [],
      displayImage: null,
      predictionArray: [],
      imgArray: [],
      loadingMore: false
    }

    this.imageRef = React.createRef();
  }

  changeTheme = () => {
    var root = document.querySelector(':root');
    if (!this.state.lightMode) {
      // Light Mode
      root.style.setProperty('--primary-background-color', '#EDEDED');
      root.style.setProperty('--secondary-background-color', '#ffffff');
      root.style.setProperty('--text-color', 'black');
    } else {
      // Dark Mode
      root.style.setProperty('--primary-background-color', '#2b2b2b');
      root.style.setProperty('--secondary-background-color', '#3b3b3b');
      root.style.setProperty('--text-color', 'white');
    }

    this.setState({lightMode: !this.state.lightMode})
  }

  readFirebaseImages = () => {
    const imageRef = ref(database, '/images')
		this.locationSubscription = onValue(imageRef, (snapshot) => {
			const data = snapshot.val()
			let images = data
			console.log(images)
			this.setState({ fileList: images })
		})
  }

  writeFirebaseImages = (selectedItems) => {
    let refDate = `${new Date()}`

    // const storage = getStorage();
    // const storageRef = imageStorageRef(storage, 'test');

    // // 'file' comes from the Blob or File API
    // uploadBytes(storageRef, this.state.fileList[0]).then((snapshot) => {
    //   console.log('Uploaded a blob or file!');
    // });

    set(ref(database, `/${refDate}`), {
      selectedItems
    });
  }

  saveImage = (event) => {
    if (event.target.files?.length > 0) {
      let fileList = [...this.state.fileList]
      fileList.push(...event.target.files)
      this.setState({
        imageToPreview: 0,
        fileList
      })
    }
  }

  selectImage = (index) => {
    this.setState({imageToPreview: index, predictions: this.state.predictionArray[index], imgData: this.state.imgArray[index]})
  }

  selectResultImage = (index) => {
    this.setState({resultToPreview: index})
  }

  movePreviewImage = (increment) => {
    if (increment && this.state.imageToPreview !== this.state.fileList.length - 1) {
      this.setState({imageToPreview: this.state.imageToPreview + 1})
    } else if (!increment && this.state.imageToPreview !== 0) {
      this.setState({imageToPreview: this.state.imageToPreview - 1})
    }
  }

  changeTab = (newTab) => {
    if (newTab > this.state.tabSelected) {
      this.setState({tabSelected: newTab, shiftLeft: true})
    } else {
      this.setState({tabSelected: newTab, shiftLeft: false})
    }
  }

  normalizePredictions = (predictions, imgSize) => {
    if (!predictions || !imgSize || !this.imageRef) return predictions || []
    return predictions.map((prediction) => {
      const { bbox } = prediction
      const oldX = bbox[0]
      const oldY = bbox[1]
      const oldWidth = bbox[2]
      const oldHeight = bbox[3]

      const imgWidth = this.imageRef.current.width
      const imgHeight = this.imageRef.current.height

      const x = (oldX * imgWidth) / imgSize.width
      const y = (oldY * imgHeight) / imgSize.height
      const width = (oldWidth * imgWidth) / imgSize.width
      const height = (oldHeight * imgHeight) / imgSize.height

      return { ...prediction, bbox: [x, y, width, height] }
    })
  }

  detectObjectsOnImage = async (imageElement, imgSize, updateMainImage, isLastImage) => {
    const model = await cocoSsd.load({})
    const predictions = await model.detect(imageElement, 6)
    const normalizedPredictions = this.normalizePredictions(predictions, imgSize)
    let predictionArray = [...this.state.predictionArray]
    predictionArray.push(normalizedPredictions)
    if (updateMainImage) {
      this.setState({predictions: predictionArray[0], predictionArray, imgData: this.state.imgArray[0], imageToPreview: 0})
    } else {
      this.setState({predictionArray})
    }
    if (isLastImage) {
      this.setState({loadingMore: false})
    }
    console.log("Predictions: ", predictions)
  }

  readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader()
      fileReader.onload = () => rs(fileReader.result)
      fileReader.onerror = () => rj(fileReader.error)
      fileReader.readAsDataURL(file)
    })
  }

  onSelectImage = async (e, triggerLoading = true) => {
    if (e.target.files?.length === 0 || !e.target.files) {
      return false
    }

    if (triggerLoading)
      this.setState({isLoading: true})

    if (e.target.files?.length > 1) {
      this.setState({loadingMore: true})
      let imgArray = [...this.state.imgArray]
      for (let i = 0; i < e.target.files.length; ++i) {
        const file = e.target.files[i]
        const imgData = await this.readImage(file)
        imgArray.push(imgData)
        if (i === e.target.files.length - 1) {
          if (this.state.imgArray.length > 0) {
            this.setState({imgArray})
          } else {
            this.setState({imgData: imgArray[0], imgArray})
          }
        }
    
        const imageElement = document.createElement("img")
        imageElement.src = imgData
    
        imageElement.onload = async () => {
          const imgSize = {
            width: imageElement.width,
            height: imageElement.height,
          }
          await this.detectObjectsOnImage(imageElement, imgSize, i === 0 ? true : false, i === e.target.files.length - 1 ? true : false)
          this.setState({isLoading: false})
        }
      }
    } else if (e.target.files?.length === 1) {
      this.setState({loadingMore: true})
      let imgArray = [...this.state.imgArray]
      const file = e.target.files[0]
      const imgData = await this.readImage(file)
      imgArray.push(imgData)
      this.setState({imgData: imgArray[0], imgArray})
  
      const imageElement = document.createElement("img")
      imageElement.src = imgData
  
      imageElement.onload = async () => {
        const imgSize = {
          width: imageElement.width,
          height: imageElement.height,
        }
        await this.detectObjectsOnImage(imageElement, imgSize, true, true)
        this.setState({isLoading: false})
      }
    }
  }

  deleteImages = () => {
    this.setState({
      imgData: null,
      predictions: [],
      displayImage: null,
      predictionArray: [],
      imgArray: [],
      imageToPreview: 0
    })
  }

  addImages = () => {
    
  }

  render() {
    return (
      <div className="App">
        <div className='headerWrapper'>
          <h1 className='logoText'>Segmentit</h1>
          <button className='headerThemeButton' onClick={this.changeTheme}><FontAwesomeIcon className='headerThemeIcon' icon={this.state.lightMode ? solid('moon') : solid('sun')} /></button>
        </div>
        <div className='applicationBodyWrapper'>
          {/* <nav className='navbarContainer'>
            <a className={`navbarLink ${this.state.tabSelected === 1 ? 'navbarLinkSelected' : this.state.tabSelected > 1 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(1)}>Upload Images</a>
            <a className={`navbarLink ${this.state.tabSelected === 2 ? 'navbarLinkSelected' : this.state.tabSelected > 2 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(2)}>Select Objects</a>
            <a className={`navbarLink ${this.state.tabSelected === 3 ? 'navbarLinkSelected' : this.state.tabSelected > 3 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(3)}>View Results</a>
          </nav> */}
          <AnimatePresence exitBeforeEnter>
            { this.state.tabSelected === 1 ?
              <UploadImage
                key={'UploadImage'}
                fileList={this.state.fileList}
                imageToPreview={this.state.imageToPreview}
                displayImage={this.state.imgData}
                selectImage={this.selectImage}
                movePreviewImage={this.movePreviewImage}
                changeTab={this.changeTab}
                saveImage={this.onSelectImage}
                imageRef={this.imageRef}
                predictions={this.state.predictions}
                predictionArray={this.state.predictionArray}
                imgArray={this.state.imgArray}
                isLoading={this.state.isLoading}
                loadingMore={this.state.loadingMore}
                deleteImages={this.deleteImages}
                addImages={(e) => this.onSelectImage(e, false)}
              />
            : this.state.tabSelected === 2 ?
              <SelectObjects
                key={'SelectObject'}
                changeTab={this.changeTab}
                writeFirebaseImages={this.writeFirebaseImages}
              />
            :
              <ViewResults
                key={'ViewResult'}
                fileList={this.state.resultsFileList}
                imageToPreview={this.state.resultToPreview}
                selectImage={this.selectResultImage}
              />
            }
          </AnimatePresence>
        </div>
      </div>
    );
  }
}

export default App;
