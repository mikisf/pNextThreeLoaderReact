import dynamic from 'next/dynamic';

const PNextThreeLoader = dynamic(() => import('../components/PointCloud'), {
    ssr: false,
});

export default function Home() {

    return (
        <PNextThreeLoader />
    )
}