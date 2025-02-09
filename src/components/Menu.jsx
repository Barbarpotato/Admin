import { Button, Divider, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React, { Fragment } from 'react'


function CustomMenu({ MenuItemList, KeyAction }) {
    return (
        <Menu>
            <MenuButton colorScheme='purple' as={Button} variant={'outline'}>
                Actions
            </MenuButton>
            <MenuList bg={"#292b37"}>
                {
                    MenuItemList.map((item, index) => (
                        <Fragment key={index}>
                            <MenuItem bg={"#292b37"} key={index} onClick={() => item.onClick(KeyAction)}>
                                {item.label}
                            </MenuItem>
                            {index !== MenuItemList.length - 1 && <Divider />}
                        </Fragment>
                    ))
                }
            </MenuList>
        </Menu >
    )
}

export default CustomMenu