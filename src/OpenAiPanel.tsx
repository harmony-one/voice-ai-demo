import React, { useCallback, useEffect, useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true
});

export const OpenAIPanel = () => {
    const [message, setMessage] = useState('');

    const reqMessage = useCallback(async () => {
        let resMessage = ''

        const stream = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'What is your name?' }],
            stream: true,
        });

        for await (const part of stream) {
            resMessage += (part.choices[0]?.delta?.content || '');
            setMessage(resMessage);
        }
    }, []);

    useEffect(() => {
        reqMessage();
    }, [])

    return <div>
        {message}
    </div>
}
