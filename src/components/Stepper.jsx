// Core Modules
import {
    useSteps, Stepper, Step, StepNumber, StepIndicator,
    StepStatus, StepIcon, StepTitle, StepDescription,
    StepSeparator, Box, Button, Hide, Flex, Spacer
} from '@chakra-ui/react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import { IconContext } from 'react-icons';
import { Fragment } from 'react'


function CustomStepper({ steps = [{ title: "", description: "", childComponent: <></> }], handleClearContent = () => { } }) {

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })

    return (
        <Fragment>

            <Flex>
                <></>
                <Spacer />
                <IconContext.Provider value={{ color: "#D91656", size: "2.5em" }}>
                    <Button size={"xs"} onClick={handleClearContent} p={0} variant={'ghost'} colorScheme='white'>
                        <FiDelete />
                    </Button>
                </IconContext.Provider>
            </Flex>

            <Hide below='lg'>
                <Stepper colorScheme='purple' index={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            </Hide>

            <Flex mb={4}>
                <Button
                    size={"sm"} mt={4}
                    colorScheme='purple'
                    onClick={() => setActiveStep(activeStep === 0 ? 0 : activeStep - 1)}
                    isDisabled={activeStep === 0}>
                    <IoMdArrowDropleft />
                </Button>
                <Spacer />
                <Button
                    size={'sm'} mt={4}
                    colorScheme='purple'
                    onClick={() => setActiveStep(activeStep === steps.length - 1 ? steps.length - 1 : activeStep + 1)}
                    isDisabled={activeStep === steps.length - 1}>
                    <IoMdArrowDropright />
                </Button>
            </Flex>

            {steps[activeStep].childComponent}

        </Fragment>
    )
}

export default CustomStepper