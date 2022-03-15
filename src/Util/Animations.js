
// export const pageTransition = {
//     in: {
//         opacity: 1,
//     },
//     out: {
//         opacity: 1,
//     },
//     initial: {
//         opacity: 1,
//     }
// }

export const cardTransition = {
    in: {
        scaleY: 1,
        rotateY: 0
    },
    out: {
        scaleY: 0.95,
        rotateY: 90
    },
    initial: {
        scaleY: 0.95,
        rotateY: 90
    }
}

export const pageTransitionLeft = {
    in: {
        x: '0%',
        opacity: 1,
        transition: 'ease-out'
    },
    out: {
        x: '-2%',
        opacity: 0,
        transition: 'ease-in'
    },
    initial: {
        x: '2%',
        opacity: 0,
        transition: 'ease-out'
    }
}

export const pageTransitionRight = {
    in: {
        x: '0%',
        opacity: 1,
        transition: 'ease-out'
    },
    out: {
        x: '2%',
        opacity: 0,
        transition: 'ease-in'
    },
    initial: {
        x: '-2%',
        opacity: 0,
        transition: 'ease-out'
    }
}

export const backdropTransition = {
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
    initial: {
        opacity: 0,
    }
}

export const settingsDrawerTransition = {
    in: {
        y: '0%',
        transition: 'ease-out'
    },
    out: {
        y: '100%',
        transition: 'ease-in'
    },
    initial: {
        y: '100%',
        transition: 'ease-out'
    }
}

export const popupTransition = {
    in: {
        y: '-50%',
        x: '-50%',
        scale: 1,
        zIndex: 51,
        opacity: 1
    },
    out: {
        y: '-47.5%',
        x: '-50%',
        scale: 0.97,
        zIndex: 51,
        opacity: 0
    },
    initial: {
        y: '-47.5%',
        x: '-50%',
        scale: 0.97,
        zIndex: 51,
        opacity: 0
    }
}

// export const openTopRight = {
//     in: {
//         x: '0%',
//         y: '0%',
//         scale: 1,
//         opacity: 1
//     },
//     out: {
//         x: '5%',
//         y: '-5%',
//         scale: 0.9,
//         opacity: 0,
//     },
//     initial: {
//         x: '5%',
//         y: '-5%',
//         scale: 0.9,
//         opacity: 0,
//     }
// }

export const transitionDuration = .1
// export const modalTransitionDuration = .15
