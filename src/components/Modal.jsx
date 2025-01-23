import {
    Button, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react'
import React from 'react'

function CustomModal({ modalTitle = "", modalSize = "full", isOpen, onClose, children }) {
    return (
        <Modal
            variant="purple"
            colorScheme="black"
            isOpen={isOpen} onClose={onClose} size={modalSize}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {children}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='purple' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CustomModal