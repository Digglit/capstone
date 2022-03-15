import React, { Component } from 'react'
import './ViewResults.css'
import { motion } from 'framer-motion'
import { pageTransitionLeft, transitionDuration } from '../../Util/Animations'

export default class ViewResults extends Component {
    render() {
        return (
            <motion.div className='contentContainer' initial={pageTransitionLeft.initial} animate={pageTransitionLeft.in} exit={pageTransitionLeft.out} transition={{ duration: transitionDuration }} key='ViewResults'>
                <div className='contentImageInputWrapper' style={{ border: this.props.fileList.length === 0 ? '2px dashed rgb(190, 190, 190)' : '0px'}}>
                    <img src={this.props.fileList[this.props.imageToPreview]} className='contentImageInputPreview'/>
                </div>
                <div className='contentImagePreviewWrapper'>
                    {this.props.fileList.map((value, index) => (
                        <img className={`contentImagePreview ${this.props.imageToPreview === index ? 'contentImagePreviewSelected' : ''}`} onClick={() => this.props.selectImage(index)} src={value} key={index}/>
                    ))}
                </div>
            </motion.div>
        )
    }
}
