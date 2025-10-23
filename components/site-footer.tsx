import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container max-w-[1600px] py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qrusible%20logo%20black%20full-200h-FnYlbjtDUNGZzNr5eEjbqPAnYaUFkf.png"
              alt="Qrusible Logo"
              width={100}
              height={30}
              className="h-6 w-auto"
            />
            <span className="text-sm text-muted-foreground">- Registered 2025</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
