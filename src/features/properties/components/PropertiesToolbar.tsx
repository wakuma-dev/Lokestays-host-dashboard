import { Input } from "@/components/ui/input";
type PropertiesTableToolbarProps = {
  table: {
    state: {
      globalFilter?: unknown;
    };
    setGlobalFilter: (value: string) => void;
  };
};
export default function PropertiesToolbar({table}: PropertiesTableToolbarProps){
    return(
    <Input 
      type="search"
      value={String(table.state.globalFilter ?? "")}
      onChange={(event) => {
        table.setGlobalFilter(event.currentTarget.value)
      }}
      placeholder="Search properties..."
      aria-label="Search properties"
      className="h-10 w-full sm:w-72"
      />
    )
}