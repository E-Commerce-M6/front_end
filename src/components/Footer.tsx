import { Box, Flex, Heading, IconButton, Text, List, ListItem, Link, Button, Menu, MenuButton, MenuItem, MenuList, MenuGroup } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon,ExternalLinkIcon} from "@chakra-ui/icons";
import { useState } from "react";

function Footer() {
  const [showSubMenu, setShowSubMenu] = useState(false);

  return (
    <Box
      as="footer"
      bg="black"
      color="white"
      py={{ base: "2", md: "4" }}
      px={{ base: "2", md: "6" }}
      mt={{ base: "2", md: "4" }}
      ml={{ base: "2", md: "4" }}
      mr={{ base: "2", md: "4" }}
    >
      <Flex
        px="25px"
        py="10px"
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        flexWrap="wrap"
        flexDirection={{ base: "column", md: "row" }}
        gap={{base: "20px"}}
      >
        <Heading as="h3" >Motors Shop</Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>© 2022 - Todos os direitos reservados.</Text>
        <Menu>
  <MenuButton bg="black" _hover={{bg:"" }} as={Button} _active={{bg:""}}>
  {<ChevronUpIcon />}
  </MenuButton>
  <MenuList color="black">
  <MenuItem>ir ao top</MenuItem>
    <MenuGroup title="Colaboradores">
    <MenuItem  as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >Rafael
    </MenuItem>
    <MenuItem as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >jalles</MenuItem>
    <MenuItem as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >Nicole </MenuItem>
    <MenuItem as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >Guilherme </MenuItem>
    <MenuItem as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >Lucas</MenuItem>
    <MenuItem as={Link} href="https://www.linkedin.com/in/rafaelsantos7520/" >Felipe </MenuItem>
    </MenuGroup>

  </MenuList>
</Menu>
        {/* <Box position="relative">
  <IconButton
    icon={<ChevronUpIcon />}
    aria-label="button-scrool-top"
    color="white"
    boxSize={{ base: "8", md: "6" }}
    px="5px"
    py="5px"
    bg="#212529"
    border="0px"
    _hover={{ backgroundColor: "#555" }}
    mr={{ base: "2", md: "0" }}
    onClick={() => setShowSubMenu(!showSubMenu)}
  />
  {showSubMenu && (
    <Box
      position="absolute"
      top="40px"
      right="0"
      bg="#fff"
      p="2"
      minWidth="200px"
      boxShadow="md"
      zIndex="1"
      borderRadius="md"
    >
      <List spacing="1">
        <ListItem>
          <Link href="https://www.linkedin.com/in/rafaelsantos7520/" display="flex" alignItems="center" color="#1A1A1A" _hover={{color: "#0077B5"}}>
            <Text fontSize={{ base: "sm", md: "md" }}>Rafael</Text>
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" display="flex" alignItems="center" color="#1A1A1A" _hover={{color: "#0077B5"}}>
            <Text fontSize={{ base: "sm", md: "md" }}>Jalles</Text>
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" display="flex" alignItems="center" color="#1A1A1A" _hover={{color: "#0077B5"}}>
            <Text fontSize={{ base: "sm", md: "md" }}>Nicole</Text>
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" display="flex" alignItems="center" color="#1A1A1A" _hover={{color: "#0077B5"}}>
            <Text fontSize={{ base: "sm", md: "md" }}>Lucas</Text>
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" display="flex" alignItems="center" color="#1A1A1A" _hover={{color: "#0077B5"}}>
            <Text fontSize={{ base: "sm", md: "md" }}>Guilherme</Text>
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
      </List>
    </Box>
  )}
</Box> */}

      </Flex>
    </Box>
  )
}

export default Footer;
