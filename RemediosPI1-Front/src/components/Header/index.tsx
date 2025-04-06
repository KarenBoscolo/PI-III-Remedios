import { Flex, Image } from "@chakra-ui/react"
import Logo from '../../assets/logo-branco.png'

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {

  return (
    <Flex
      align="center"
      justify="center"
      height='75'
      p='5'      
      role="img"
      aria-label="Logo projeto Remédio Solidário"
      data-testid="header"
      borderBottom="1px solid #c7c4c4"
    >
      <Image
        src={Logo}
        alt='Logo projeto Remédio Solidário'
        width='100px'
        height='37px'
      />
    </Flex>
  )
}

export default Header