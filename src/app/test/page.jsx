import React from 'react'

const handleSubmitSurvey = async () => {
    try {
        const result = await axios.get('/api/survey')
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
const page = () => {
    return (
        <>
            <button onClick={handleSubmitSurvey}>Submit Survey</button>
            <div>{result}</div>
        </>
    )
}

export default page