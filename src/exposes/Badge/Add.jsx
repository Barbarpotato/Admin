// Core Modules
import { useToast } from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { FiDelete } from "react-icons/fi";
import { Box, Input, Button, Flex, Spacer } from '@chakra-ui/react';

// API Modules
import { PostBadge } from '../../api/badges/POST';

// Custom Hooks
import useLocalStorage from '../../hooks/useLocalstorage';

function AddBadge({ token }) {

    const [content, setContent] = useLocalStorage('content-badge', {
        title: "",
        description: "",
        company_name: "",
        logo_url: "",
        credential_url: "",
        date: ""
    });

    const toast = useToast();


    const handleSubmitBadge = async () => {

        try {
            await PostBadge(content, token);

            toast({
                title: `Successfully added Badge Data`,
                status: "success",
            });

            setContent({
                title: "",
                description: "",
                company_name: "",
                logo_url: "",
                credential_url: "",
                date: ""
            });
        } catch (err) {
            console.error(err)
            toast({
                title: `Something went wrong`,
                status: "error",
            })
        }
    }

    const handleClearContent = () => {
        setContent({
            title: "",
            description: "",
            company_name: "",
            logo_url: "",
            credential_url: "",
            date: ""
        });
        localStorage.removeItem("content-badge");
        toast({
            title: `Content has been cleared`,
            status: "success"
        })
    }

    return (
        <Box my={4}>
            <Flex>
                <></>
                <Spacer />
                <IconContext.Provider value={{ color: "#D91656", size: "2.5em" }}>
                    <Button onClick={handleClearContent} p={0} variant={'ghost'} colorScheme='white'>
                        <FiDelete />
                    </Button>
                </IconContext.Provider>
            </Flex>

            <label>Title</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Title' onChange={(e) => setContent({ ...content, title: e.target.value })} value={content.title} />
            <label>Description</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Description' onChange={(e) => setContent({ ...content, description: e.target.value })} value={content.description} />
            <label>Company Name</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Example: By IBM' onChange={(e) => setContent({ ...content, company_name: e.target.value })} value={content.company_name} />
            <label>Logo URL</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Your Logo image Url' onChange={(e) => setContent({ ...content, logo_url: e.target.value })} value={content.logo_url} />
            <label>Credential URL</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Your Certificate Url' onChange={(e) => setContent({ ...content, credential_url: e.target.value })} value={content.credential_url} />
            <label>Date</label>
            <Input borderRadius={'2xl'} size={'lg'} borderWidth={3} colorScheme='purple' borderColor={"#536189"} focusBorderColor={"#ff79c6"}
                my={2} placeholder='Date. Format: DD-MM-YYYY'
                onChange={(e) => {
                    setContent({ ...content, date: e.target.value });
                }}
                value={content.date} />
            <Button my={4} colorScheme='purple' onClick={handleSubmitBadge}>Add Badge</Button>
        </Box>
    )
}

export default AddBadge