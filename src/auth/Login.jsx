import { Box, Button, Flex, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        app_token: process.env.APP_TOKEN  // Prefixed environment variable
    });

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
            toast({ title: "Success logging in!", status: "success", isClosable: false });
            setIsLoading(false);
            localStorage.setItem('token', data?.token);
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
            <Flex height={'90vh'} alignItems="center" justifyContent="center">
                <Box width={'70%'} className='lighting-effect-pink' borderRadius={'2xl'} p={5}>
                    <Heading textAlign={'center'} my={2} fontSize={'2xl'}>Login</Heading>
                    <form onSubmit={onSubmit}> {/* Wrap in a form */}
                        <Box mx={2}>
                            <Text>Username</Text>
                            <Input
                                placeholder="Username"
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
                                placeholder="Password"
                                borderRadius={'2xl'} my={5} size={'lg'} borderWidth={3}
                                colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                                onChange={onChange}
                                value={loginData.password}
                                type="password"
                                name="password"
                                required
                            />
                        </Box>
                        <Button type="submit" isLoading={isLoading} my={3} mx={2} fontWeight={'bold'} colorScheme='purple' color={'black'}>
                            Login
                        </Button>
                    </form>
                </Box>
            </Flex>
        </Fragment>
    );
};

export default Login;
