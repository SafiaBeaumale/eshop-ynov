"use client";

import { StaticPage } from "@/components/static-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, Users, Zap, Heart } from "lucide-react";

const jobs = [
  {
    title: "Développeur Full Stack",
    location: "Paris",
    type: "CDI",
    department: "Tech",
  },
  {
    title: "Product Manager",
    location: "Paris",
    type: "CDI",
    department: "Produit",
  },
  {
    title: "Customer Success Manager",
    location: "Lyon",
    type: "CDI",
    department: "Support",
  },
  {
    title: "UX/UI Designer",
    location: "Remote",
    type: "CDI",
    department: "Design",
  },
  {
    title: "Data Analyst",
    location: "Paris",
    type: "CDI",
    department: "Data",
  },
];

export default function CarrieresPage() {
  return (
    <StaticPage
      title="Carrières"
      description="Rejoignez une équipe passionnée et innovante."
      icon={Briefcase}
    >
      <div className="space-y-12 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Pourquoi nous rejoindre ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Travaillez sur des projets passionnants avec les dernières technologies.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Équipe</h3>
                <p className="text-sm text-muted-foreground">
                  Une équipe bienveillante et collaborative.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Bien-être</h3>
                <p className="text-sm text-muted-foreground">
                  Télétravail flexible, mutuelle, tickets restaurant.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Nos offres d'emploi</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Button size="sm">Postuler</Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Envoyez-nous votre candidature spontanée, nous sommes toujours à la
            recherche de talents !
          </p>
          <Button size="lg">Candidature spontanée</Button>
        </section>
      </div>
    </StaticPage>
  );
}
