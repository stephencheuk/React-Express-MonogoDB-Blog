import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
    <ContentLoader
        speed={2}
        width={"100%"}
        height={256}
        viewBox="0 0 100% 256"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >

        <rect x="3" y="5" rx="0" ry="0" width="349" height="250" />
        <rect x="375" y="13" rx="0" ry="0" width="100%" height="34" />
        <rect x="375" y="64" rx="0" ry="0" width="100%" height="24" />
        <rect x="374" y="109" rx="0" ry="0" width="100%" height="24" />
    </ContentLoader>
)

export default MyLoader