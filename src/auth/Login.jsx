// Core Modules
import {
    Box, Button, Flex, Heading, Input,
    Text, useToast, useDisclosure, Alert,
    AlertDescription, CloseButton, Spacer
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom Hooks
import useSession from "../hooks/useSession";

// Custom Components
import Loading from "../components/Loading";


const Login = () => {

    const [year, _setYear] = useState(new Date().getFullYear());

    const [_token, setToken] = useSession("token", null);
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        app_token: process.env.APP_TOKEN  // Prefixed environment variable
    });

    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: true })

    const onChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            setIsLoading(true);
            const loginApi = await fetch("https://coretify.vercel.app/login/client", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (!loginApi.ok) {
                toast({ title: "Invalid credential, Please try again.", status: 'error', isClosable: false });
                setIsLoading(false);
                return;
            }

            const data = await loginApi.json();
            setToken(data?.token);
            toast({ title: "Success logging in!", status: "success", isClosable: false });
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            console.error(error);
            toast({ title: `${error}`, status: 'error', isClosable: false });
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <Fragment>
            <Box className='stars'></Box>
            <Box className='stars2'></Box>
            <Box className='stars3'></Box>
            <Box height={'80vh'}>
                {isVisible && (
                    <Alert color={'black'} status='error'>
                        <Flex width={'100%'} alignItems={'center'} justifyContent={'center'}>
                            <AlertDescription textAlign={'center'}>
                                Hello, This service is under Barbarpotato's private management. The service is restricted to public users.
                            </AlertDescription>
                            <Spacer />
                            <CloseButton
                                alignSelf='flex-start'
                                position='relative'
                                right={-1}
                                top={-1}
                                onClick={onClose}
                            />
                        </Flex>

                    </Alert>
                )}

                <Flex width="100%" height={"100%"} direction={'column'} alignItems={"center"} justifyContent="center">
                    <Box className='lighting-effect-pink' borderRadius={'2xl'} p={5}>
                        <form onSubmit={onSubmit}> {/* Wrap in a form */}

                            <Heading textAlign={'center'} fontSize={'2xl'} my={5}>Admin Panel</Heading>
                            <Box mx={2}>
                                <Text>Username</Text>
                                <Input
                                    placeholder="👤 Username"
                                    borderRadius={'2xl'} my={5} size={'lg'} borderWidth={3}
                                    colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                                    onChange={onChange}
                                    value={loginData.username}
                                    type="text"
                                    name="username"
                                    required
                                />
                            </Box>

                            <Box mx={2}>
                                <Text>Password</Text>
                                <Input
                                    placeholder="🔒 Password"
                                    borderRadius={'2xl'} my={5} size={'lg'} borderWidth={3}
                                    colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                                    onChange={onChange}
                                    value={loginData.password}
                                    type="password"
                                    name="password"
                                    required
                                />
                            </Box>
                            <Box mx={2}>
                                <Button width={'100%'} type="submit" isLoading={isLoading} my={3} fontWeight={'bold'} colorScheme='purple' color={'black'}>
                                    Log in
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Flex>
                <Text fontSize={'sm'} textAlign={'center'}>
                    © 2024 - {year} All Rights Reserved
                </Text>
            </Box>
        </Fragment>

    );
};

export default Login;
