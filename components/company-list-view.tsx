import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, BriefcaseBusiness, Bell } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  logo: string
  lastActivity: string
  activeRoles: number
  notifications: number
}

interface CompanyListViewProps {
  companies: Company[]
  searchTerm: string
}

export function CompanyListView({ companies, searchTerm }: CompanyListViewProps) {
  // Filter companies based on search term
  const filteredCompanies = companies.filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search</p>
        </div>
      ) : (
        filteredCompanies.map((company) => (
          <Link href={`/clients/${company.id}`} key={company.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo} alt={company.name} />
                      <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Last activity: {company.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <BriefcaseBusiness className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-medium">{company.activeRoles}</span>
                      <span className="ml-1 text-muted-foreground">active roles</span>
                    </div>
                    {company.notifications > 0 && (
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                        <Badge variant="secondary" className="font-medium">
                          {company.notifications} updates
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
