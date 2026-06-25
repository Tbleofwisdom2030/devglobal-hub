import Link from 'next/link';
import { ProductCard as ProductCardType } from '@devglobal/shared';
import { Button, Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@devglobal/ui';
import { formatPrice } from '@/lib/utils';
import { Package, Star } from 'lucide-react';

interface ProductCardProps {
  product: ProductCardType;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="h-48 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          {product.imageUrls?.[0] ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
          {product.version && (
            <Badge variant="outline" className="text-xs">
              v{product.version}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">
            {formatPrice(product.priceCents, product.currency)}
          </span>
        </div>
        <Button variant="gradient" size="sm" asChild>
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}