import React, { Component } from 'react'
import './UploadImage.css'
import { motion } from 'framer-motion'
import { pageTransitionLeft, transitionDuration } from '../../Util/Animations'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import styled from "styled-components";
import MDSpinner from 'react-md-spinner'

const TargetBox = styled.div`
  position: absolute;

  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};

  border: 4px solid #1ac71a;
  z-index: 20;
  pointer-events: none;

  &::before {
    content: "${({ classType, score }) => `${classType} ${score.toFixed(1)}%`}";
    color: #1ac71a;
    border: 4px solid #1ac71a;
    background-color: rgba(0, 0, 0, 0.5);
    font-weight: 700;
    padding: 5px;
    font-size: 17px;
    position: absolute;
    top: -20px;
    left: -5px;
    pointer-events: none;
  }
`

export default class UploadImage extends Component {
    render() {
        return (
            <motion.div className='contentContainer' initial={pageTransitionLeft.initial} animate={pageTransitionLeft.in} exit={pageTransitionLeft.out} transition={{ duration: transitionDuration }} key='UploadImages'>
                <div className='contentImageInputWrapper' style={{ border: this.props.fileList.length === 0 ? '2px dashed rgb(190, 190, 190)' : '0px'}}>
                    {this.props.predictionArray.length === 0 && <input type='file' className='contentImageInput' multiple onChange={this.props.saveImage}></input>}
                    {this.props.predictionArray.length === 0 &&
                        <div className='contentImageInputInfoContainer'>
                            <div className='contentImageInputInfoIconContainer'>
                                <FontAwesomeIcon className='contentImageInputInfoIcon' icon={solid('images')}/>
                            </div>
                            <p className='contentImageInputInfoIconText'>Select some images to upload</p>
                        </div>
                    }
                    {/* {this.props.fileList.length > 0 && <img src={URL.createObjectURL(this.props.fileList[this.props.imageToPreview])} className='contentImageInputPreview'/>} */}
                    {this.props.displayImage && <img ref={this.props.imageRef} src={this.props.displayImage} className='contentImageInputPreview'/>}
                    {this.props.predictions.length > 0 && 
                        this.props.predictions.map((prediction, idx) => (
                            <TargetBox
                              key={idx}
                              x={prediction.bbox[0]}
                              y={prediction.bbox[1]}
                              width={prediction.bbox[2]}
                              height={prediction.bbox[3]}
                              classType={prediction.class}
                              score={prediction.score * 100}
                            />
                          ))
                    }
                    {this.props.isLoading &&
                        <div className='loadingBackdrop'>
                            <MDSpinner singleColor="#3eb889" size={48}/>
                        </div>
                    }
                </div>
                <div className='contentImagePreviewWrapper'>
                    {this.props.imgArray.length === 0 &&
                        <div className='contentImagePreviewPlaceholder'/>
                    }
                    {this.props.predictionArray.map((value, index) => (
                        <img className={`contentImagePreview ${this.props.imageToPreview === index ? 'contentImagePreviewSelected' : ''}`} onClick={() => this.props.selectImage(index)} src={this.props.imgArray[index]} key={index}/>
                    ))}
                    {this.props.loadingMore &&
                        <div className='contentImagePreviewPlaceholder' style={{marginLeft: this.props.predictionArray.length === 0 ? 0 : 10}}>
                            <MDSpinner singleColor="#3eb889" size={32}/>
                        </div>
                    }
                </div>
                <div className='contentFooterWrapper'>
                    <button className={`contentFooterButton ${this.props.predictionArray.length === 0 ? 'contentDisabled' : ''}`}><FontAwesomeIcon className='uploadImageIcon' icon={solid('images')} />Add Images <input type='file' multiple onChange={this.props.addImages} className='fileInputAddImagesButton'/></button>
                    <button className={`contentFooterButton ${this.props.predictionArray.length === 0 ? 'contentDisabled' : ''}`} onClick={() => this.props.deleteImages()}><FontAwesomeIcon className='uploadImageIcon' icon={solid('trash-can')} />Delete</button>
                    <div className={`contentFooterInfoContainer ${this.props.predictionArray.length === 0 ? 'contentDisabled' : ''}`}>
                        <p className='contentFooterInfoText'>Total Images: {this.props.imgArray.length}</p>
                        <span className='contentFooterInfoDivider' />
                        <p className='contentFooterInfoText'> Image Selected: {this.props.imageToPreview === 0 ? 0 : this.props.imageToPreview + 1}</p>
                    </div>
                </div>
            </motion.div>
        )
    }
}
