import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string) => void;
}

const Header = ({
  onSearch = () => console.log("Search triggered"),
  onFilterChange = () => console.log("Filter changed"),
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-primary">App Store</div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 max-w-md flex-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onFilterChange("category")}>
                Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("rating")}>
                Rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("date")}>
                Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </form>
      </div>

      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Mobile search")}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
