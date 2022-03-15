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
import ProcessedImage from './Assets/OpenCVImage.png'

class App extends Component {
  constructor() {
    super()
    this.state = {
      lightMode: true,
      tabSelected: 1,
      imageToPreview: 0,
      fileList: [],
      shiftLeft: false,
      resultsFileList: [ProcessedImage],
      resultToPreview: 0
    }
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
    this.setState({imageToPreview: index})
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

  render() {
    return (
      <div className="App">
        <div className='headerWrapper'>
          <h1 className='logoText'>Segmentit</h1>
          <button className='headerThemeButton' onClick={this.changeTheme}><FontAwesomeIcon className='headerThemeIcon' icon={this.state.lightMode ? solid('moon') : solid('sun')} /></button>
        </div>
        <div className='applicationBodyWrapper'>
          <nav className='navbarContainer'>
            <a className={`navbarLink ${this.state.tabSelected === 1 ? 'navbarLinkSelected' : this.state.tabSelected > 1 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(1)}>Upload Images</a>
            <a className={`navbarLink ${this.state.tabSelected === 2 ? 'navbarLinkSelected' : this.state.tabSelected > 2 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(2)}>Select Objects</a>
            <a className={`navbarLink ${this.state.tabSelected === 3 ? 'navbarLinkSelected' : this.state.tabSelected > 3 ? 'navbarLinkComplete' : 'navbarLinkIncomplete'}`} onClick={() => this.changeTab(3)}>View Results</a>
          </nav>
          <AnimatePresence exitBeforeEnter>
            { this.state.tabSelected === 1 ?
              <UploadImage
                key={'UploadImage'}
                fileList={this.state.fileList}
                imageToPreview={this.state.imageToPreview}
                selectImage={this.selectImage}
                movePreviewImage={this.movePreviewImage}
                changeTab={this.changeTab}
                saveImage={this.saveImage}
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
