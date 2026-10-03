import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Link from "next/link";
import ArticlesButton from "@/components/UI/Button";

export const metadata = {
    title: "Ice Slide",
    description: "Page not found",
};

export default function Page() {
    return (
        <Box sx={{
            position: "relative", isolation: "isolate", flexGrow: 1, display: "flex",
            justifyContent: "center", alignItems: "center", minHeight: "100vh",
            "[data-bs-theme='dark'] & .MuiCard-root": { boxShadow: "0px 0px 34px -10px #a7eefc" },
        }}>
            <Box sx={{
                position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1,
                "[data-bs-theme='dark'] & img": { opacity: 0.25 },
            }}>
                <Box component="img"
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Ice Slide/ice-slide-background.jpg`}
                    alt=""
                    sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "blur(10px)" }}
                />
            </Box>
            <Container sx={{
                display: "flex", flexDirection: "column-reverse", justifyContent: "center",
                alignItems: "center", py: "1rem",
                "@media (min-width: 992px)": { flexDirection: "row" },
            }}>
                <Box sx={{ width: "20rem", maxWidth: "100%" }}>
                    <Box component="img" src="/img/logo.png" alt="Ice Slide"
                        sx={{ width: "100%", position: "relative", zIndex: 1, m: "0 auto" }}
                    />
                    <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider", mb: 2, fontSize: "0.875rem" }}>
                        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            Page not found. Please check the URL and try again.
                        </CardContent>
                    </Card>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ArticlesButton component={Link} href="/">Return to Home</ArticlesButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

