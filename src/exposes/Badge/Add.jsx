// Core Modules
import { Fragment } from 'react';
import { Input, Button } from '@chakra-ui/react';

// API Modules
import { PostBadge } from '../../api/badges/POST';

// Custom Hooks
import useLocalStorage from '../../hooks/useLocalstorage';

// Context
import { useGlobalContext } from '../../contexts/GlobalContext';

// Custom Components
import CustomStepper from '../../components/Stepper';


function AddBadge({ token }) {

    const { toast } = useGlobalContext();

    const [content, setContent] = useLocalStorage('content-badge', {
        title: "",
        description: "",
        company_name: "",
        logo_url: "",
        credential_url: "",
        date: ""
    });

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

    const steps = [
        { title: 'Main Information', description: 'Add the general information of the Badge', childComponent: <MainContent token={token} content={content} setContent={setContent} /> },
    ]

    return (
        <CustomStepper steps={steps} handleClearContent={handleClearContent} />
    )
}

function MainContent({ token, content, setContent }) {

    const { toast } = useGlobalContext();

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

    return (
        <Fragment>
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
                my={2} placeholder='Date. Format: MM-DD-YYYY'
                onChange={(e) => {
                    setContent({ ...content, date: e.target.value });
                }}
                value={content.date} />
            <Button my={4} colorScheme='purple' onClick={handleSubmitBadge}>Add Badge</Button>
        </Fragment>
    )
}

export default AddBadge