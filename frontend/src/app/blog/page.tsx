"use client";

import { StaticPage } from "@/components/static-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Calendar, Clock } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    title: "Les tendances tech de 2024",
    excerpt:
      "Découvrez les innovations qui vont révolutionner notre quotidien cette année.",
    category: "Tendances",
    date: "15 Jan 2024",
    readTime: "5 min",
  },
  {
    title: "Guide d'achat : Comment choisir son smartphone",
    excerpt:
      "Tous nos conseils pour trouver le smartphone qui correspond à vos besoins.",
    category: "Guides",
    date: "10 Jan 2024",
    readTime: "8 min",
  },
  {
    title: "L'impact de l'IA sur les produits tech",
    excerpt:
      "Comment l'intelligence artificielle transforme les appareils que nous utilisons.",
    category: "Innovation",
    date: "5 Jan 2024",
    readTime: "6 min",
  },
  {
    title: "Test : Les meilleurs écouteurs sans fil",
    excerpt:
      "Notre comparatif des écouteurs bluetooth les plus performants du marché.",
    category: "Tests",
    date: "28 Dec 2023",
    readTime: "10 min",
  },
  {
    title: "Sécurité : Protégez vos appareils connectés",
    excerpt:
      "Les bonnes pratiques pour sécuriser votre maison connectée.",
    category: "Sécurité",
    date: "20 Dec 2023",
    readTime: "7 min",
  },
  {
    title: "Green Tech : Vers une technologie plus durable",
    excerpt:
      "Les initiatives des fabricants pour réduire leur impact environnemental.",
    category: "Environnement",
    date: "15 Dec 2023",
    readTime: "6 min",
  },
];

export default function BlogPage() {
  return (
    <StaticPage
      title="Blog TechShop"
      description="Actualités, guides et conseils tech pour rester informé."
      icon={BookOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {articles.map((article, index) => (
          <Link href="#" key={index}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <Badge variant="secondary" className="w-fit">
                  {article.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </StaticPage>
  );
}
