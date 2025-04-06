import {
  Modal as ModalChakra,
  ModalProps as ModalPropsChakra,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"

interface ModalProps extends ModalPropsChakra {
  modalFooter?: React.ReactNode
  modalHeaderText?: string
  showCloseButton?: boolean
}
const BaseModal = ({
  children,
  isOpen,
  onClose,
  modalHeaderText,
  modalFooter,
  showCloseButton = true,
  ...rest
}: ModalProps) => {
  return (
    <ModalChakra isOpen={isOpen} onClose={onClose} isCentered {...rest} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='#00834F' textAlign={'center'}>
          {modalHeaderText}
        </ModalHeader>
        {showCloseButton &&
          <ModalCloseButton color='#00834F' />
        }
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{modalFooter}</ModalFooter>
      </ModalContent>
    </ModalChakra>
  )
}

export default BaseModal