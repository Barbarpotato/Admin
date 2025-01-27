import React, { Fragment } from 'react'
import { Flex } from '@chakra-ui/react'
import '../index.css'

function Loading() {
    return (
        <Fragment>
            <Flex height={'100vh'} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </Flex>
        </Fragment>
    )
}

export default Loading