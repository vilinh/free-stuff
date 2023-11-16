import "./SearchResults.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import RadioGroup from "@cloudscape-design/components/radio-group";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import axios from "axios";
import { Categories, ListingStatus, SortBy } from "../../utils/enum";
import Spinner from "@cloudscape-design/components/spinner";
import TokenGroup from "@cloudscape-design/components/token-group";
import { useParams } from "react-router-dom";

export const SearchResults = () => {
	const [listings, setListings] = useState([]);
	const [allListings, setAllListings] = useState([]);
	const [status, setStatus] = useState(ListingStatus.Any);
	const [sort, setSort] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [catTokens, setCatTokens] = useState([]);
	const [catTokensSet, setCatTokensSet] = useState(new Set());

	const { address } = useLocationContext();
	const { term } = useParams();

	useEffect(() => {
		const getListings = async () => {
			try {
				let res = await axios.get(
					`http://localhost:8000/listing?location=${address}&title=${
						term ?? ""
					}`
				);
				setListings(res.data);
				setAllListings(res.data);
			} catch (error) {}
			setIsLoading(false);
		};
		getListings();
	}, []);

	useEffect(() => {
		let filtered = allListings;
		catTokens.forEach(
			(cat) =>
				(filtered = filtered.filter((l) =>
					l.details.categories.includes(cat.label)
				))
		);
		if (status === ListingStatus.Claimed) {
			filtered = filtered.filter((l) => l.claimed);
		} else if (status === ListingStatus.Unclaimed) {
			filtered = filtered.filter((l) => !l.claimed);
		}
		setListings(filtered);
		console.log(filtered);
	}, [status, catTokens]);

	useEffect(() => {
		switch (sort) {
			case SortBy.DatePosted:
				setListings(
					listings.sort((a, b) =>
						a.details.posted_date > b.details.posted_date
							? 1
							: b.details.posted_date > a.details.posted_date
							? -1
							: 0
					)
				);
				break;
			default:
				return;
		}
	}, [sort]);

	const handleSelectCategory = (k) => {
		if (catTokensSet.has(k) === false) {
			setCatTokensSet(new Set([...catTokensSet, k]));
			setCatTokens([...catTokens, { label: k, dismissLabel: `Remove ${k}` }]);
		}
	};

	const handleRemoveCategory = (itemIndex) => {
		setCatTokensSet(
			new Set([...catTokensSet].filter((x) => x !== catTokens[itemIndex].label))
		);
		setCatTokens([
			...catTokens.slice(0, itemIndex),
			...catTokens.slice(itemIndex + 1),
		]);
	};

	return (
		<div className="search-results">
			<div className="search-bar"></div>
			<h3 className="search-results-title">Search results</h3>
			<div className="search-results-main">
				<div className="filter-bar">
					<h4>Filter By</h4>
					<hr />
					<div className="status">
						<h4>Status</h4>
						<div className="status-buttons">
							<RadioGroup
								onChange={({ detail }) => setStatus(detail.value)}
								value={status}
								items={[
									{ value: ListingStatus.Any, label: ListingStatus.Any },
									{
										value: ListingStatus.Claimed,
										label: ListingStatus.Claimed,
									},
									{
										value: ListingStatus.Unclaimed,
										label: ListingStatus.Unclaimed,
									},
								]}
							/>
						</div>
						<hr />
						<div className="category">
							<h4>Category</h4>
							<div className="category-options">
								{Object.keys(Categories).map((k) => (
									<span
										key={k}
										className="cat-opt"
										onClick={() => handleSelectCategory(k)}
									>
										{k}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="results">
					<div className="results-bar">
						<TokenGroup
							onDismiss={({ detail: { itemIndex } }) => {
								handleRemoveCategory(itemIndex);
							}}
							items={catTokens}
						/>
						<ButtonDropdown
							className="sort-button"
							onItemClick={(e) => {
								setSort(e.detail.id);
							}}
							items={[
								{
									text: SortBy.DatePosted,
									id: SortBy.DatePosted,
									disabled: false,
								},
								{ text: SortBy.Distance, id: SortBy.Distance, disabled: false },
							]}
						>
							Sort By
						</ButtonDropdown>
					</div>

					<div className="listings">
						{isLoading ? (
							<Spinner />
						) : listings.length !== 0 ? (
							<>
								{listings.map((listing, key) => (
									<ListingThumbnail
										listing={listing}
										key={key}
										editListing={false}
									/>
								))}
							</>
						) : (
							<p>No listings found</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
