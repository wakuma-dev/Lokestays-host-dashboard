import { createFileRoute } from "@tanstack/react-router";
import TermsOfService from "@/pages/TermsOfService";
export const Route = createFileRoute("/_main/terms-of-services")({
    component: TermsOfService
});