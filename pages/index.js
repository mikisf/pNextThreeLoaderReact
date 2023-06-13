import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';

const PNextThreeLoader = dynamic(() => import('../components/PNextThreeLoader'), {
    ssr: false,
});

export default function Home() {

    return (
        <PNextThreeLoader />
    )
}