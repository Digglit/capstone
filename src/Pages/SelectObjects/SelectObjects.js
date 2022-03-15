import React, { Component } from 'react'
import './SelectObjects.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { pageTransitionLeft, transitionDuration } from '../../Util/Animations'
import { motion } from 'framer-motion'
import MDSpinner from 'react-md-spinner'

export default class SelectObjects extends Component {
    constructor() {
        super()
        this.state = {
            items: [
                {
                    name: 'Car',
                    selected: false
                },
                {
                    name: 'People',
                    selected: false
                },
                {
                    name: 'Stop Sign',
                    selected: false
                },
                {
                    name: 'Pencil',
                    selected: false
                },
                {
                    name: 'Tree',
                    selected: false
                },
                {
                    name: 'Dog',
                    selected: false
                }
            ],
            fetchOutstanding: false
        }
    }

    selectItem = (itemIndex) => {
        let items = [...this.state.items]
        items[itemIndex].selected = !items[itemIndex].selected
        this.setState({items})
    }

    processImages = () => {
        this.setState({fetchOutstanding: true})
        let selectedItems = []

        this.state.items.forEach((value, index) => {
            if (value.selected)
                selectedItems.push(value.name)
        })

        this.props.writeFirebaseImages(selectedItems)
        setTimeout(() => {
            this.setState({fetchOutstanding: false}, () => {
                this.props.changeTab(3)
            })
        }, 1500)
    }

    render() {
        return (
            <motion.div className='selectObjectsContentContainer' initial={pageTransitionLeft.initial} animate={pageTransitionLeft.in} exit={pageTransitionLeft.out} transition={{ duration: transitionDuration }} key='SelectObjects'>
                <div className='selectObjectsListWrapper'>
                    {this.state.items.map((value, index) => (
                        <div className='selectObjectsListItem' onClick={() => this.selectItem(index)} key={value.name}>
                            <div className={`selectObjectsCheckbox ${value.selected ? 'selectObjectsCheckboxSelected' : ''}`}>
                                {value.selected && <FontAwesomeIcon className='checkboxIcon' icon={solid('check')} />}
                            </div>
                            <p className={`selectObjectsText ${value.selected ? 'selectObjectsTextSelected' : ''}`}>{value.name}</p>
                        </div>
                    ))}
                </div>
                <div className='selectObjectsFooterWrapper'>
                    <div className='placeholderElement'/>
                    <button className='selectObjectsFooterButton secondaryButton' onClick={() => this.props.changeTab(1)}>Back to Images</button>
                    {!this.state.fetchOutstanding ? 
                        <button className='selectObjectsFooterButton primaryButton' onClick={this.processImages}>Continue</button>
                    :
                        <div className='spinnerContainer'>
                            <MDSpinner singleColor="#2F9B9B" size={28}/>
                        </div>
                    }
                </div>
            </motion.div>
        )
    }
}
