import React, { Component } from 'react'
import './UploadImage.css'
import { motion } from 'framer-motion'
import { pageTransitionLeft, transitionDuration } from '../../Util/Animations'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class UploadImage extends Component {
    render() {
        return (
            <motion.div className='contentContainer' initial={pageTransitionLeft.initial} animate={pageTransitionLeft.in} exit={pageTransitionLeft.out} transition={{ duration: transitionDuration }} key='UploadImages'>
                <div className='contentImageInputWrapper' style={{ border: this.props.fileList.length === 0 ? '2px dashed rgb(190, 190, 190)' : '0px'}}>
                    <input type='file' className='contentImageInput' multiple onChange={this.props.saveImage}></input>
                    {this.props.fileList.length > 0 && <img src={URL.createObjectURL(this.props.fileList[this.props.imageToPreview])} className='contentImageInputPreview'/>}
                </div>
                <div className='contentImagePreviewWrapper'>
                    {this.props.fileList.length === 0 &&
                        <div className='contentImagePreviewPlaceholder'/>
                    }
                    {this.props.fileList.map((value, index) => (
                        <img className={`contentImagePreview ${this.props.imageToPreview === index ? 'contentImagePreviewSelected' : ''}`} onClick={() => this.props.selectImage(index)} src={URL.createObjectURL(value)} key={index}/>
                    ))}
                </div>
                <div className='contentFooterWrapper'>
                    <button className={`contentFooterButton ${this.props.fileList.length === 0 ? 'contentDiasbled' : ''}`} onClick={() => this.props.movePreviewImage(false)}><FontAwesomeIcon className='headerThemeIcon' icon={solid('arrow-left-long')} /></button>
                    <button className={`contentFooterButton ${this.props.fileList.length === 0 ? 'contentDiasbled' : ''}`} onClick={() => this.props.movePreviewImage(true)}><FontAwesomeIcon className='headerThemeIcon' icon={solid('arrow-right-long')} /></button>
                    <button className={`contentFooterSubmitButton primaryButton ${this.props.fileList.length === 0 ? 'contentDiasbled' : ''}`} onClick={() => this.props.changeTab(2)}>Continue</button>
                </div>
            </motion.div>
        )
    }
}
