// Core Modules
import {
    Box, Button, Flex, Heading, Input, InputGroup, InputLeftElement,
    Text, useToast, useDisclosure
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiAlertCircle, FiX } from "react-icons/fi";

// Custom Hooks
import useSession from "../hooks/useSession";

// Custom Modules
import base_url from "../api/index.js";

// Custom Components
import Loading from "../components/Loading";


const Login = () => {

    const [year] = useState(new Date().getFullYear());

    const [_token, setToken] = useSession("token", null);
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const {
        isOpen: isNoticeVisible,
        onClose: onNoticeClose,
    } = useDisclosure({ defaultIsOpen: true })

    const onChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            setIsLoading(true);

            const loginApi = await fetch(`${base_url()}/verify/login`, {
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

            <Flex minH={'100vh'} width="100%" direction={'column'} alignItems={'center'} justifyContent={'center'} p={4}>
                {isNoticeVisible && (
                    <Flex
                        maxW={'420px'} w={'100%'} mb={5} p={3} borderRadius={'lg'}
                        bg={'rgba(204, 123, 201, 0.1)'} borderLeft={'3px solid #cc7bc9'}
                        align={'flex-start'} gap={2}
                    >
                        <Box color={'#cc7bc9'} mt={'2px'}><FiAlertCircle /></Box>
                        <Text fontSize={'sm'} color={'#d0d0d0'} flex={1}>
                            This service is under Barbarpotato's private management and is restricted to public users.
                        </Text>
                        <Box
                            as="button" onClick={onNoticeClose} color={'#c0c0c0'}
                            _hover={{ color: '#faf9ff' }} mt={'2px'}
                        >
                            <FiX />
                        </Box>
                    </Flex>
                )}

                <Box
                    className='lighting-effect-pink'
                    bg={'#383a4a'} borderRadius={'2xl'} p={{ base: 6, md: 10 }} w={'100%'} maxW={'420px'}
                >
                    <form onSubmit={onSubmit}>
                        <Flex direction={'column'} align={'center'} mb={6}>
                            <Box
                                borderRadius={'full'} border={'2px solid #866bab'} overflow={'hidden'}
                                w={'64px'} h={'64px'} mb={4}
                            >
                                <img
                                    src='https://raw.githubusercontent.com/Barbarpotato/barbarpotato.github.io/c567a034bac07cae94577428a808e5af7513be4a/public/Avatar.svg'
                                    alt='Admin avatar' width='100%' height='100%'
                                />
                            </Box>
                            <Heading
                                textAlign={'center'} fontSize={'2xl'}
                                fontFamily={'var(--font-playfair)'} fontStyle={'italic'} fontWeight={700} color={'#faf9ff'}
                            >
                                Admin Panel
                            </Heading>
                            <Text fontSize={'sm'} color={'#c0c0c0'} mt={1}>
                                Sign in to manage your site
                            </Text>
                        </Flex>

                        <Box mb={4}>
                            <Text fontSize={'sm'} color={'#c0c0c0'} mb={1}>Username</Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' color={'#866bab'}>
                                    <FiUser />
                                </InputLeftElement>
                                <Input
                                    placeholder="Username"
                                    borderRadius={'xl'} size={'lg'} borderWidth={2}
                                    borderColor={'#866bab'} focusBorderColor={'#cc7bc9'}
                                    onChange={onChange}
                                    value={loginData.username}
                                    type="text"
                                    name="username"
                                    required
                                />
                            </InputGroup>
                        </Box>

                        <Box mb={6}>
                            <Text fontSize={'sm'} color={'#c0c0c0'} mb={1}>Password</Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' color={'#866bab'}>
                                    <FiLock />
                                </InputLeftElement>
                                <Input
                                    placeholder="Password"
                                    borderRadius={'xl'} size={'lg'} borderWidth={2}
                                    borderColor={'#866bab'} focusBorderColor={'#cc7bc9'}
                                    onChange={onChange}
                                    value={loginData.password}
                                    type="password"
                                    name="password"
                                    required
                                />
                            </InputGroup>
                        </Box>

                        <Button
                            width={'100%'} type="submit" isLoading={isLoading} fontWeight={'bold'}
                            bg={'#866bab'} color={'#faf9ff'} _hover={{ bg: '#cc7bc9' }} size={'lg'} borderRadius={'xl'}
                        >
                            Log in
                        </Button>

                        <Text fontSize={'xs'} textAlign={'center'} color={'#c0c0c0'} opacity={0.7} mt={6}>
                            © 2024 - {year} All Rights Reserved
                        </Text>
                    </form>
                </Box>
            </Flex>
        </Fragment>
    );
};

export default Login;
